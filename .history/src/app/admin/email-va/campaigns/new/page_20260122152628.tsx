"use client";

import { useState } from "react";
import {
    createCampaign,
    sendCampaign,
} from "../../../../../../actions/email-va/campaigns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateCampaignPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    const handleSaveDraft = async () => {
        if (!name || !subject || !body) {
            alert("Please fill all required fields");
            return;
        }

        setLoading(true);
        const result = await createCampaign({
            name,
            subject,
            bodyHtml: body.replace(/\n/g, "<br>"),
            bodyPlain: body,
            recipientTags: tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
        });

        setLoading(false);

        if (result.success) {
            alert("Campaign saved as draft");
            router.push("/admin/email-va/campaigns");
        } else {
            alert(result.error);
        }
    };

    const handleSendNow = async () => {
        if (!name || !subject || !body) {
            alert("Please fill all required fields");
            return;
        }

        if (!confirm("Send this campaign now? This cannot be undone.")) return;

        setLoading(true);
        const createResult = await createCampaign({
            name,
            subject,
            bodyHtml: body.replace(/\n/g, "<br>"),
            bodyPlain: body,
            recipientTags: tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
        });

        if (!createResult.success) {
            setLoading(false);
            alert(createResult.error);
            return;
        }

        setSending(true);
        if (!createResult.campaignId) {
            throw new Error("campaignId is required");
        }

        const sendResult = await sendCampaign(createResult.campaignId);
        setSending(false);
        setLoading(false);

        if (sendResult.success) {
            alert(
                `Campaign sent! ${sendResult.sent} sent, ${sendResult.failed} failed`,
            );
            router.push("/admin/email-va/campaigns");
        } else {
            alert(sendResult.error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/admin/email-va/campaigns">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Campaigns
                        </Button>
                    </Link>
                </div>

                <Card className="p-8">
                    <h1 className="text-2xl font-bold mb-6">Create Campaign</h1>

                    <div className="space-y-6">
                        {/* Campaign Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Q1 Newsletter"
                            />
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Subject{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Your monthly update from {{company}}"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Use {`{{name}}`} and {`{{company}}`} for
                                personalization
                            </p>
                        </div>

                        {/* Body */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Body{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder={`Hi {{name}},

We hope this email finds you well!

[Your message here]

Best regards,
Your Agency Team`}
                                rows={15}
                                className="font-mono"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Variables: {`{{name}}, {{company}}`}
                            </p>
                        </div>

                        {/* Recipient Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Recipient Tags (comma-separated)
                            </label>
                            <Input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="client, newsletter, prospect"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Leave empty to send to all active leads
                            </p>
                        </div>

                        {/* Preview */}
                        <div className="bg-gray-50 p-4 rounded border">
                            <h3 className="font-semibold mb-2">Preview:</h3>
                            <p className="text-sm mb-1">
                                <strong>Subject:</strong>{" "}
                                {subject || "(No subject)"}
                            </p>
                            <div className="mt-2 p-3 bg-white rounded border text-sm">
                                <p className="whitespace-pre-wrap">
                                    {body || "(No content)"}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                onClick={handleSaveDraft}
                                disabled={loading || sending}
                                variant="outline"
                                className="flex-1"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save as Draft
                            </Button>
                            <Button
                                onClick={handleSendNow}
                                disabled={loading || sending}
                                className="flex-1"
                            >
                                {sending ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Now
                                    </>
                                )}
                            </Button>
                        </div>

                        {sending && (
                            <div className="bg-blue-50 p-4 rounded border border-blue-200 text-blue-800 text-sm">
                                <p className="font-medium">
                                    Sending campaign...
                                </p>
                                <p className="text-xs mt-1">
                                    This may take a few minutes depending on the
                                    number of recipients.
                                </p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
