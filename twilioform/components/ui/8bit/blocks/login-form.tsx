"use client";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/8bit/textarea";
import { useState } from "react";

import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { Label } from "@/components/ui/8bit/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    console.log("Sending form data:", formData);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "Email sent successfully! 🎉" });
        setFormData({ to: "", subject: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: result.error || "Failed to send email",
        });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">SendGrid API Email Sender</CardTitle>
          <CardDescription className="text-xs">
            Enter the email recipient below and the message you want to send.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {status.message && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    status.type === "success"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="to">To Email</Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.to}
                  onChange={handleInputChange("to")}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Welcome to our platform! 🎉"
                  value={formData.subject}
                  onChange={handleInputChange("subject")}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message here..."
                  value={formData.message}
                  onChange={handleInputChange("message")}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
