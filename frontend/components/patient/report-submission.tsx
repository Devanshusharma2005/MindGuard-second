"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export function ReportSubmission() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setError("");
      } else {
        setError("Please upload a PDF file only");
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:3000/health-tracking/upload-report", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload report");
      }

      setSuccess(true);
      setSelectedFile(null);
    } catch (err) {
      setError("Failed to upload report. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <h3 className="text-lg font-semibold">Report Submitted Successfully!</h3>
            <p className="text-sm text-muted-foreground text-center">
              Your medical report has been successfully uploaded and will be reviewed by your healthcare provider.
            </p>
            <Button
              variant="outline"
              onClick={() => setSuccess(false)}
              className="mt-4"
            >
              Submit Another Report
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submit Medical Report</CardTitle>
        <CardDescription>
          Upload your medical reports in PDF format for review by your healthcare provider
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF files only</p>
              </div>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {selectedFile && (
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{selectedFile.name}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Submit Report"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 