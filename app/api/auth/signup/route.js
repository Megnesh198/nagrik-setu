import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, password, govtProofType, govtProofNumber, role } = await req.json();

    const userCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return NextResponse.json({ success: false, message: 'User already exists with this email!' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role || 'user';

    const insertQuery = `
      INSERT INTO users (name, email, password, role, govt_proof_type, govt_proof_number, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, role;
    `;
    const values = [name, email, hashedPassword, assignedRole, govtProofType, govtProofNumber, true];
    const newUser = await query(insertQuery, values);

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to NagrikSetu - Smart City Grievance Portal',
        text: `Hello ${name},\n\nWelcome to NagrikSetu! Your account has been successfully registered with verified Government ID (${govtProofType}). You can now log in securely.\n\nRegards,\nNagrikSetu Team`,
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Registered successfully & Welcome email sent!', 
      user: newUser.rows[0] 
    }, { status: 201 });

  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}