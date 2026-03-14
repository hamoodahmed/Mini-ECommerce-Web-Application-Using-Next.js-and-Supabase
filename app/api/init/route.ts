// app/api/init/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    // Check if admin user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@example.com')
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is the error code when no rows are returned
      throw fetchError;
    }

    if (existingUser) {
      return NextResponse.json({
        message: 'Admin user already exists',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          role: existingUser.role
        }
      });
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create default admin user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          email: 'admin@example.com',
          password_hash: hashedPassword,
          role: 'ADMIN',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating admin user:', insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Database initialized successfully',
      user: { id: newUser.id, email: newUser.email, role: newUser.role }
    });
  } catch (error: any) {
    console.error('Error in database initialization:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}