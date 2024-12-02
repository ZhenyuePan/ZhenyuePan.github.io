import { NextResponse } from 'next/server';
import { Client } from 'pg'; // 确保已安装 pg 包
import path from 'path';
import fs from 'fs/promises';

export async function GET(req: Request) {
  try {
    const placeholderDataPath = path.resolve('path/to/your/placeholder-data.ts');
    const placeholderData = require(placeholderDataPath);

    const client = new Client({
      connectionString: process.env.DATABASE_URL, // 使用环境变量配置数据库连接
    });

    await client.connect();

    // 遍历 placeholderData 并插入数据
    for (const tableName in placeholderData) {
      const data = placeholderData[tableName];
      for (const row of data) {
        const keys = Object.keys(row).join(', ');
        const values = Object.values(row).map((value) => `'${value}'`).join(', ');
        const query = `INSERT INTO ${tableName} (${keys}) VALUES (${values})`;

        await client.query(query);
      }
    }

    await client.end();
    return new NextResponse('Database seeded successfully', { status: 200 });
  } catch (err) {
    console.error('Error inserting data:', err);
    return new NextResponse('Failed to seed database', { status: 500 });
  }
}

