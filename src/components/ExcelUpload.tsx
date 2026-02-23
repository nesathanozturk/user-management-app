"use client";

import { AlertCircle, CheckCircle, FileSpreadsheet, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { BulkUploadError, BulkUploadResponse } from "@/types";

const ALLOWED_EXTENSIONS = [".xlsx", ".xls"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ExcelUpload = () => {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<BulkUploadError[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const validateFile = useCallback((selectedFile: File): string | null => {
    const extension = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return "Invalid file type. Please upload an Excel file (.xlsx or .xls)";
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      return "File size exceeds 5MB limit";
    }
    return null;
  }, []);

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      const error = validateFile(selectedFile);
      if (error) {
        setServerMessage(error);
        setErrors([]);
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setServerMessage("");
      setErrors([]);
      setSuccess(false);
    },
    [validateFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    },
    [handleFileSelect]
  );

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setErrors([]);
    setServerMessage("");
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file) return;

    setIsUploading(true);
    setErrors([]);
    setServerMessage("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/users/bulk", {
        body: formData,
        method: "POST",
      });

      const data: BulkUploadResponse = await response.json();

      if (!response.ok) {
        setServerMessage(data.message || "Upload failed");
        toast(data.message || "Upload failed");
        if (data.errors) {
          setErrors(data.errors);
        }
        return;
      }

      setSuccess(true);
      setServerMessage(data.message || "Upload successful");
      toast(data.message || "Users uploaded successfully", "success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch {
      setServerMessage("An unexpected error occurred");
      toast("An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  }, [file, router]);

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          dragActive
            ? "border-gray-900 bg-gray-50"
            : "border-gray-300 hover:border-gray-400",
          file && "border-gray-400 bg-gray-50"
        )}
        onClick={() => fileInputRef.current?.click()}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleInputChange}
          ref={fileInputRef}
          type="file"
        />

        {file ? (
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="mb-3 h-10 w-10 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              Drag & drop your Excel file here
            </p>
            <p className="mt-1 text-xs text-gray-500">
              or click to browse (.xlsx, .xls, max 5MB)
            </p>
          </>
        )}
      </div>

      {file && !success && (
        <Button
          className="w-full"
          isLoading={isUploading}
          onClick={handleUpload}
        >
          Upload and Import Users
        </Button>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
          <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
          <p className="text-sm text-green-800">{serverMessage}</p>
        </div>
      )}

      {!success && serverMessage && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <p className="text-sm text-red-800">{serverMessage}</p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-red-800">
            Errors found ({errors.length})
          </h3>
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-red-200">
                  <th className="py-1 pr-3 text-left font-medium text-red-700">Row</th>
                  <th className="py-1 pr-3 text-left font-medium text-red-700">Field</th>
                  <th className="py-1 text-left font-medium text-red-700">Error</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((err, idx) => (
                  <tr className="border-b border-red-100" key={idx}>
                    <td className="py-1 pr-3 text-red-700">{err.row}</td>
                    <td className="py-1 pr-3 text-red-700">{err.field}</td>
                    <td className="py-1 text-red-700">{err.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-gray-700">
          Expected Excel Format
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 pr-4 text-left font-medium text-gray-600">name</th>
                <th className="py-2 pr-4 text-left font-medium text-gray-600">surname</th>
                <th className="py-2 pr-4 text-left font-medium text-gray-600">email</th>
                <th className="py-2 pr-4 text-left font-medium text-gray-600">age</th>
                <th className="py-2 text-left font-medium text-gray-600">password</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-gray-500">
                <td className="py-2 pr-4">John</td>
                <td className="py-2 pr-4">Doe</td>
                <td className="py-2 pr-4">john@example.com</td>
                <td className="py-2 pr-4">25</td>
                <td className="py-2">pass123</td>
              </tr>
              <tr className="text-gray-500">
                <td className="py-2 pr-4">Jane</td>
                <td className="py-2 pr-4">Smith</td>
                <td className="py-2 pr-4">jane@example.com</td>
                <td className="py-2 pr-4">30</td>
                <td className="py-2">pass456</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExcelUpload;
