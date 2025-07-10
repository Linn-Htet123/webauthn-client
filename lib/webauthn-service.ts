/* eslint-disable @typescript-eslint/no-explicit-any */
class WebAuthnService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  async register(userData: { email: string; username: string }) {
    try {
      // Step 1: Start registration
      const startResponse = await fetch(`${this.baseUrl}/auth/register/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!startResponse.ok) {
        throw new Error("Failed to start registration");
      }

      const options = await startResponse.json();

      // Step 2: Create credentials using WebAuthn API
      const credential = (await navigator.credentials.create({
        publicKey: {
          ...options,
          challenge: this.base64ToUint8Array(options.challenge),
          user: {
            ...options.user,
            id: this.base64ToUint8Array(options.user.id),
          },
        },
      })) as PublicKeyCredential;

      if (!credential) {
        throw new Error("Failed to create credential");
      }

      // Step 3: Complete registration
      const registrationResponse = this.credentialToJSON(credential);

      const completeResponse = await fetch(`${this.baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          registrationResponse,
        }),
      });

      if (!completeResponse.ok) {
        throw new Error("Failed to complete registration");
      }

      return await completeResponse.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async login(userData: { email: string }) {
    try {
      // Step 1: Start login
      const startResponse = await fetch(`${this.baseUrl}/auth/login/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!startResponse.ok) {
        throw new Error("Failed to start login");
      }

      const options = await startResponse.json();

      // Step 2: Get credentials using WebAuthn API
      const credential = (await navigator.credentials.get({
        publicKey: {
          ...options,
          challenge: this.base64ToUint8Array(options.challenge),
          allowCredentials: options.allowCredentials?.map((cred: any) => ({
            ...cred,
            id: this.base64ToUint8Array(cred.id),
          })),
        },
      })) as PublicKeyCredential;

      if (!credential) {
        throw new Error("Failed to get credential");
      }

      // Step 3: Complete login
      const loginResponse = this.credentialToJSON(credential);

      const completeResponse = await fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          loginResponse,
        }),
      });

      if (!completeResponse.ok) {
        throw new Error("Failed to complete login");
      }

      return await completeResponse.json();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private uint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binaryString = "";
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binaryString)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  private credentialToJSON(credential: PublicKeyCredential) {
    const response = credential.response as
      | AuthenticatorAttestationResponse
      | AuthenticatorAssertionResponse;

    const baseResponse = {
      id: credential.id,
      rawId: this.uint8ArrayToBase64(new Uint8Array(credential.rawId)),
      type: credential.type,
      response: {
        clientDataJSON: this.uint8ArrayToBase64(
          new Uint8Array(response.clientDataJSON)
        ),
      },
    };

    if (response instanceof AuthenticatorAttestationResponse) {
      return {
        ...baseResponse,
        response: {
          ...baseResponse.response,
          attestationObject: this.uint8ArrayToBase64(
            new Uint8Array(response.attestationObject)
          ),
        },
      };
    } else if (response instanceof AuthenticatorAssertionResponse) {
      return {
        ...baseResponse,
        response: {
          ...baseResponse.response,
          authenticatorData: this.uint8ArrayToBase64(
            new Uint8Array(response.authenticatorData)
          ),
          signature: this.uint8ArrayToBase64(
            new Uint8Array(response.signature)
          ),
          userHandle: response.userHandle
            ? this.uint8ArrayToBase64(new Uint8Array(response.userHandle))
            : null,
        },
      };
    }

    return baseResponse;
  }
}

export const webAuthnService = new WebAuthnService();
