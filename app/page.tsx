"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegistrationForm } from "@/components/registration-form"
import { LoginForm } from "@/components/login-form"
import { Fingerprint } from "lucide-react"

export default function WebAuthnClient() {
  const [activeTab, setActiveTab] = useState("register")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Fingerprint className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">WebAuthn Authentication</CardTitle>
          <CardDescription>Secure authentication using biometrics or security keys</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            <TabsContent value="register" className="mt-6">
              <RegistrationForm onSuccess={() => setActiveTab("login")} />
            </TabsContent>
            <TabsContent value="login" className="mt-6">
              <LoginForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
