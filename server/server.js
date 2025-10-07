import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import PDFDocument from 'pdfkit'
import nodemailer from 'nodemailer'
import supabase from './supabaseclient.js'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

// ROI bias factor (for simulation realism)
const ROI_BIAS = 1.1

// 📈 ROI Calculation API — now also saves values to Supabase
app.post('/api/calculate-roi', async (req, res) => {
  const { invoices, staff, wage, cost } = req.body

  if (!invoices || !staff || !wage || !cost) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  const totalGain = invoices * staff * wage * 0.05 // Example logic
  const roi = ((totalGain - cost) / cost) * 100 * ROI_BIAS

  // 🗃 Save simulation values to Supabase
  const { error } = await supabase.from('reports').insert([
    {
      value1: invoices,
      value2: staff,
      value3: wage,
      value4: cost,
      roi: roi.toFixed(2),
      created_at: new Date(),
    },
  ])

  if (error) {
    console.error('❌ Supabase insert error:', error.message)
    return res.status(500).json({ error: 'Failed to save simulation data' })
  }

  res.json({ roi: roi.toFixed(2), message: '✅ Simulation saved successfully!' })
})

// 📧 Generate & Send Report + Save Record in Supabase
app.post('/api/send-report', async (req, res) => {
  const { email, roi } = req.body

  if (!email || !roi) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  // Create PDF buffer
  const pdf = new PDFDocument()
  let buffers = []
  pdf.on('data', buffers.push.bind(buffers))
  pdf.on('end', async () => {
    const pdfData = Buffer.concat(buffers)

    // 📨 Email setup (TLS for Gmail)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your ROI Report',
      text: `Here’s your ROI simulation result: ${roi}%`,
      attachments: [{ filename: 'roi-report.pdf', content: pdfData }],
    }

    // Try sending email
    let emailStatus = 'sent'
    try {
      await transporter.sendMail(mailOptions)
      console.log('✅ Email sent successfully!')
    } catch (error) {
      console.error('⚠️ Email sending failed:', error.message)
      emailStatus = 'failed'
    }

    // 🗃 Save email report record in Supabase
    const { error: dbError } = await supabase.from('reports').insert([
      {
        email,
        roi_result: parseFloat(roi),
        report_url: null,
        created_at: new Date(),
      },
    ])

    if (dbError) {
      console.error('❌ Supabase insert error:', dbError.message)
      return res.status(500).json({ error: 'Failed to save report record' })
    }

    res.json({
      message:
        emailStatus === 'sent'
          ? '✅ Report emailed and saved successfully!'
          : '⚠️ Report saved, but email failed to send.',
    })
  })

  // 🧾 PDF content
  pdf.fontSize(20).text('ROI Simulation Report', { align: 'center' })
  pdf.moveDown()
  pdf.fontSize(14).text(`Email: ${email}`)
  pdf.text(`ROI Result: ${roi}%`)
  pdf.text(`Generated At: ${new Date().toLocaleString()}`)
  pdf.end()
})

// ✅ Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
