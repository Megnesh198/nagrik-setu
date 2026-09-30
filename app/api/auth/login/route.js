import { NextResponse } from 'next/server';
import { query } from '@/utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const userCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid email or password!' }, { status: 400 });
    }

    const user = userCheck.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Invalid email or password!' }, { status: 400 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({ 
      success: true, 
      message: 'Login successful!', 
      role: user.role 
    }, { status: 200 });

    response.cookies.set('token', token, { httpOnly: true, maxAge: 86400 });
    response.cookies.set('role', user.role, { httpOnly: true, maxAge: 86400 });

    return response;

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}