import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    const statuses = {
      openai: false,
      gemini: false
    };

    // فحص OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        
        // اختبار بسيط للتحقق من صحة المفتاح
        await openai.models.list();
        statuses.openai = true;
      } catch (error) {
        console.error('OpenAI API error:', error);
        statuses.openai = false;
      }
    }

    // فحص Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // اختبار بسيط للتحقق من صحة المفتاح
        const result = await model.generateContent("test");
        const response = await result.response;
        if (response.text()) {
          statuses.gemini = true;
        }
      } catch (error) {
        console.error('Gemini API error:', error);
        statuses.gemini = false;
      }
    }

    return NextResponse.json(statuses);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'فشل في فحص حالة النماذج' },
      { status: 500 }
    );
  }
} 