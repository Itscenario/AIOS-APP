package com.aios.app

import android.content.ContentValues
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.pdf.PdfDocument
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import com.facebook.react.bridge.*
import java.io.File
import java.io.FileOutputStream
import java.io.OutputStream

class CertificateDownloaderModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "CertificateDownloader"

    @ReactMethod
    fun downloadCertificate(options: ReadableMap, promise: Promise) {
        try {
            val title = if (options.hasKey("title")) options.getString("title") ?: "Certificate" else "Certificate"
            val recipientName = if (options.hasKey("recipientName")) options.getString("recipientName") ?: "AIOS Member" else "AIOS Member"
            val memberId = if (options.hasKey("memberId")) options.getString("memberId") ?: "LM-12849" else "LM-12849"
            val location = if (options.hasKey("location")) options.getString("location") ?: "New Delhi" else "New Delhi"
            val year = if (options.hasKey("year")) options.getString("year") ?: "2025" else "2025"
            val isMembership = if (options.hasKey("isMembership")) options.getBoolean("isMembership") else false

            val sanitizedTitle = title.replace(Regex("[^a-zA-Z0-9_-]"), "_")
            val fileName = "AIOS_${sanitizedTitle}_${System.currentTimeMillis()}.pdf"

            // A4 Landscape size: 842 x 595
            val doc = PdfDocument()
            val pageInfo = PdfDocument.PageInfo.Builder(842, 595, 1).create()
            val page = doc.startPage(pageInfo)
            val canvas: Canvas = page.canvas

            // Background
            canvas.drawColor(Color.parseColor("#FFFDF7"))

            // Outer Gold Border
            val goldPaint = Paint().apply {
                color = Color.parseColor("#D97706")
                style = Paint.Style.STROKE
                strokeWidth = 4f
                isAntiAlias = true
            }
            canvas.drawRect(24f, 24f, 818f, 571f, goldPaint)

            // Inner Navy Border
            val innerBorderPaint = Paint().apply {
                color = Color.parseColor("#0A1E3F")
                style = Paint.Style.STROKE
                strokeWidth = 1.5f
                isAntiAlias = true
            }
            canvas.drawRect(30f, 30f, 812f, 565f, innerBorderPaint)

            // Header: ALL INDIA OPHTHALMOLOGICAL SOCIETY
            val headerPaint = Paint().apply {
                color = Color.parseColor("#0A1E3F")
                textSize = 22f
                isFakeBoldText = true
                textAlign = Paint.Align.CENTER
                isAntiAlias = true
            }
            canvas.drawText("ALL INDIA OPHTHALMOLOGICAL SOCIETY", 421f, 80f, headerPaint)

            val subHeaderPaint = Paint().apply {
                color = Color.parseColor("#D97706")
                textSize = 12f
                textAlign = Paint.Align.CENTER
                isAntiAlias = true
            }
            canvas.drawText("Established 1930 • From Darkness to Light", 421f, 102f, subHeaderPaint)

            // Gold divider line
            val linePaint = Paint().apply {
                color = Color.parseColor("#D97706")
                strokeWidth = 2f
            }
            canvas.drawLine(150f, 118f, 692f, 118f, linePaint)

            // Certificate Title
            val titlePaint = Paint().apply {
                color = Color.parseColor("#0A1E3F")
                textSize = 20f
                isFakeBoldText = true
                textAlign = Paint.Align.CENTER
                isAntiAlias = true
            }
            val certTitleText = if (isMembership) "CERTIFICATE OF LIFE MEMBERSHIP" else "CERTIFICATE OF PARTICIPATION"
            canvas.drawText(certTitleText, 421f, 155f, titlePaint)

            // Presentation text
            val bodyPaint = Paint().apply {
                color = Color.parseColor("#475569")
                textSize = 14f
                textAlign = Paint.Align.CENTER
                isAntiAlias = true
            }
            canvas.drawText("This is proudly presented to", 421f, 195f, bodyPaint)

            // Recipient Name
            val namePaint = Paint().apply {
                color = Color.parseColor("#E06A26")
                textSize = 28f
                isFakeBoldText = true
                textAlign = Paint.Align.CENTER
                isAntiAlias = true
            }
            canvas.drawText(recipientName.uppercase(), 421f, 240f, namePaint)

            // Description
            val descPaint = Paint().apply {
                color = Color.parseColor("#1E293B")
                textSize = 13f
                textAlign = Paint.Align.CENTER
                isAntiAlias = true
            }
            if (isMembership) {
                canvas.drawText("for distinguished enrollment as a Life Member of the society", 421f, 280f, descPaint)
                canvas.drawText("with Member Registration ID: $memberId", 421f, 305f, descPaint)
                canvas.drawText("Entitled to all rights, honors, and privileges under AIOS constitution.", 421f, 330f, descPaint)
            } else {
                canvas.drawText("for active and distinguished participation in $title", 421f, 285f, descPaint)
                canvas.drawText("held at $location in $year.", 421f, 312f, descPaint)
            }

            // Seal representation
            val sealPaint = Paint().apply {
                color = Color.parseColor("#FEF3C7")
                style = Paint.Style.FILL
            }
            canvas.drawCircle(421f, 415f, 36f, sealPaint)
            canvas.drawCircle(421f, 415f, 36f, goldPaint)

            val sealTextPaint = Paint().apply {
                color = Color.parseColor("#D97706")
                textSize = 10f
                isFakeBoldText = true
                textAlign = Paint.Align.CENTER
                isAntiAlias = true
            }
            canvas.drawText("OFFICIAL", 421f, 410f, sealTextPaint)
            canvas.drawText("SEAL", 421f, 424f, sealTextPaint)

            // Signatures
            val sigLinePaint = Paint().apply {
                color = Color.parseColor("#94A3B8")
                strokeWidth = 1f
            }
            canvas.drawLine(120f, 470f, 280f, 470f, sigLinePaint)
            canvas.drawLine(562f, 470f, 722f, 470f, sigLinePaint)

            val sigTextPaint = Paint().apply {
                color = Color.parseColor("#0F172A")
                textSize = 12f
                isFakeBoldText = true
                textAlign = Paint.Align.CENTER
                isAntiAlias = true
            }
            canvas.drawText("Dr. President, AIOS", 200f, 490f, sigTextPaint)
            canvas.drawText("Dr. Hon. General Secretary", 642f, 490f, sigTextPaint)

            val sigSubPaint = Paint().apply {
                color = Color.parseColor("#64748B")
                textSize = 10f
                textAlign = Paint.Align.CENTER
                isAntiAlias = true
            }
            canvas.drawText("President", 200f, 505f, sigSubPaint)
            canvas.drawText("Honorary General Secretary", 642f, 505f, sigSubPaint)

            // Document ID
            val docIdPaint = Paint().apply {
                color = Color.parseColor("#059669")
                textSize = 10f
                textAlign = Paint.Align.CENTER
                isAntiAlias = true
            }
            canvas.drawText("Document ID: AIOS-VERIFIED-$memberId-$year", 421f, 545f, docIdPaint)

            doc.finishPage(page)

            // Save to Downloads folder
            var filePath: String? = null

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val contentValues = ContentValues().apply {
                    put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                    put(MediaStore.MediaColumns.MIME_TYPE, "application/pdf")
                    put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/AIOS")
                }
                val resolver = reactContext.contentResolver
                val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)
                if (uri != null) {
                    val stream: OutputStream? = resolver.openOutputStream(uri)
                    if (stream != null) {
                        doc.writeTo(stream)
                        stream.close()
                        filePath = "Downloads/AIOS/$fileName"
                    }
                }
            } else {
                val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                val targetFile = File(downloadsDir, fileName)
                val fos = FileOutputStream(targetFile)
                doc.writeTo(fos)
                fos.close()
                filePath = targetFile.absolutePath
            }
            doc.close()

            val resultMap = Arguments.createMap().apply {
                putBoolean("success", true)
                putString("fileName", fileName)
                putString("filePath", filePath ?: fileName)
            }
            promise.resolve(resultMap)

        } catch (e: Exception) {
            promise.reject("DOWNLOAD_ERROR", e.message, e)
        }
    }
}
