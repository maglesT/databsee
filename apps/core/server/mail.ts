import nodemailer from 'nodemailer';

export interface Mail { to: string; subject: string; text: string }
export type SendMail = (mail: Mail) => Promise<void>;

export function smtpSender(smtpUrl: string, from: string): SendMail {
  const transport = nodemailer.createTransport(smtpUrl);
  return async (mail) => { await transport.sendMail({ from, ...mail }); };
}
