import { Repository } from "./Repository";
import { Pool, Client } from "pg";
import { MediaId } from "./MediaRepository";
import { UserId } from "./UserRepository";
import { RequestId } from "./RequestRepository";

export type MessageId = number;
export type ObjectType = {
  [key: string]: string | number | boolean | ObjectType;
}

export type MessageOpts = {
  id?: MessageId;
  text: string;
  to_user: UserId;
  from_user: UserId;
  media_id?: MediaId;
  request_id: RequestId;
  timestamp: Date;
  responses?: ObjectType;
};

export class Message {
  id: MessageId;
  text: string;
  to_user: UserId;
  from_user: UserId;
  media_id?: MediaId;
  request_id: RequestId;
  timestamp: Date;
  responses?: ObjectType;

  constructor(opts: MessageOpts) {
    this.id = opts.id;
    this.text = opts.text;
    this.to_user = opts.to_user;
    this.from_user = opts.from_user;
    this.media_id = opts.media_id;
    this.request_id = opts.request_id;
    this.timestamp = opts.timestamp;
    this.responses = opts.responses;
  }
}

export class MessageRepository implements Repository<MessageId, Message> {
  constructor(public pool: Pool) { }

  async getOne(id: MessageId): Promise<Message> {
    const res = await this.pool.query(`SELECT * FROM public.message WHERE id = $1`, [
      id
    ]);
    return new Message(res.rows[0]);
  }

  async getAll(): Promise<Message[]> {
    const res = await this.pool.query(`SELECT * FROM public.message`);
    return res.rows.map(row => new Message(row));
  }

  async save(msg: Message): Promise<Message> {
    const res = await this.pool.query(
      `
      INSERT INTO public.message (
        text,
        to_user,
        from_user,
        media_id,
        request_id,
        timestamp,
        responses
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [
        msg.text,
        msg.to_user,
        msg.from_user,
        msg.media_id,
        msg.request_id,
        msg.timestamp,
        msg.responses
      ]
    );
    return new Message(res.rows[0]);
  }

  async delete(id: MessageId): Promise<number> {
    const res = await this.pool.query(`DELETE FROM public.message WHERE id = $1`, [
      id
    ]);
    return res.rowCount;
  }

  async update(msg: Message): Promise<Message> {
    const res = await this.pool.query(
      `
      UPDATE public.message SET (
        text,
        to_user,
        from_user,
        media_id,
        request_id,
        timestamp,
        responses
      ) = ($1, $2, $3, $4, $5, $6, $7)
      WHERE id = $8
      RETURNING *
    `,
      [
        msg.text,
        msg.to_user,
        msg.from_user,
        msg.media_id,
        msg.request_id,
        msg.timestamp,
        msg.responses,
        msg.id,
      ]
    );
    return new Message(res.rows[0]);
  }
}
