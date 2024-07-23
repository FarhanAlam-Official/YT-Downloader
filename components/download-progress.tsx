"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Download, AlertCircle } from "lucide-react"

interface DownloadStatus {
  id: string
  filename: string
  progress: number
  status: "downloading" | "completed" | "error"
  error?: string
}

interface DownloadProgressProps {
  downloads: DownloadStatus[]
}

export function DownloadProgress({ downloads }: DownloadProgressProps) {
  if (downloads.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Downloads
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {downloads.map((download) => (
            <div key={download.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">{download.filename}</span>
                <div className="flex items-center gap-2">
                  {download.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {download.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                  <span className="text-sm text-gray-500">
                    {download.status === "downloading"
                      ? `${Math.round(download.progress)}%`
                      : download.status === "completed"
                        ? "Complete"
                        : "Failed"}
                  </span>
                </div>
              </div>
              <Progress value={download.progress} className="h-2" />
              {download.status === "error" && download.error && (
                <p className="text-sm text-red-500">{download.error}</p>
              )}
              {download.status === "completed" && (
                <p className="text-sm text-green-600">Download completed successfully!</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
