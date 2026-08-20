import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis de ambiente do .env na raiz do projeto (se houver)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface Database {
  orders: {
    id: string;
    order_number: string;
    color: string;
    wheel_type: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_cpf: string;
    payment_method: string;
    total_price: string;
    status: string;
    created_at: Date | string;
    updated_at: Date | string;
  };
}

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString,
    }),
  }),
});

export const OrderFactory = {
  async insertOrder(data: Partial<Database['orders']> & { status: string, order_number: string }) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.insertInto('orders')
      .values({
        id,
        color: 'glacier-blue',
        wheel_type: 'aero',
        customer_name: 'Teste Automotizado',
        customer_email: 'teste@teste.com',
        customer_phone: '(11) 99999-9999',
        customer_cpf: '123.456.789-00',
        payment_method: 'avista',
        total_price: '40000',
        created_at: now,
        updated_at: now,
        ...data,
      })
      .execute();

    return id;
  },

  async deleteOrder(order_number: string) {
    await db.deleteFrom('orders').where('order_number', '=', order_number).execute();
  },

  async deleteOrderByCPF(cpf: string) {
    const cleanCpf = cpf.replace(/\D/g, '');
    let formattedCpf = cpf;
    
    if (cleanCpf.length === 11) {
      formattedCpf = `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-${cleanCpf.slice(9, 11)}`;
    }

    await db.deleteFrom('orders')
      .where((eb) => eb.or([
        eb('customer_cpf', '=', cpf),
        eb('customer_cpf', '=', cleanCpf),
        eb('customer_cpf', '=', formattedCpf)
      ]))
      .execute();
  }
};
