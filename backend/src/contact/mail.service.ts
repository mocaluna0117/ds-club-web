import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private config: ConfigService) {}

  async sendReply(to: string, replyBody: string): Promise<void> {
    const host = this.config.get<string>('MAIL_HOST');
    const port = Number(this.config.get<string>('MAIL_PORT', '587'));
    const user = this.config.get<string>('MAIL_USER');
    const pass = this.config.get<string>('MAIL_PASS');
    const from = this.config.get<string>('MAIL_FROM') ?? user;

    if (!host || !user || !pass) {
      this.logger.warn('MAIL_HOST / MAIL_USER / MAIL_PASS が未設定です');
      throw new Error('メール設定が未完了です。サーバーの環境変数を確認してください。');
    }

    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });

    await transporter.sendMail({
      from: `"データサイエンス倶楽部" <${from}>`,
      to,
      subject: 'データサイエンス倶楽部よりご返信',
      text: replyBody,
    });
  }
}
