import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { join } from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { constants } from '../common/utils/constant';

const resend = new Resend(constants.RESEND_ACCESS_KEY);

@Injectable()
export class MailService {
  constructor() {}

  private readonly BASE_URL = `http://localhost:5070`;

  // load and compile Handlebars templates
  private compileTemplate(templatePath: string, context: any): string {
    const templateFile = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateFile);
    return compiledTemplate(context);
  }

  // handle sending email
  private async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    const mailOptions = {
      from: `no-reply <${constants.ALLOWED_RESEND_MAIL}>`,
      to,
      subject,
      html,
    };

    try {
      const emailResponse = await resend.emails.send(mailOptions);
      console.log('Email sent successfully:', emailResponse);
    } catch (e) {
      console.error(`sendMail error: Unable to send mail`, e.message, e.stack);
      throw e;
    }
  }

  async sendEmailConfirmation(
    userEmail: string,
    userName: string,
    token: string,
  ): Promise<void> {
    try {
      const url = `${this.BASE_URL}/auth/confirm?token=${token}`;

      // path to the template file
      const templatePath = join(
        __dirname,
        'templates',
        'email-confirmation.hbs',
      );

      // Compile the Handlebars template with the provided context
      const html = this.compileTemplate(templatePath, {
        name: userName,
        url,
      });

      await this.sendEmail(
        userEmail,
        `Welcome! Verify your email address`,
        html,
      );
    } catch (e) {
      console.error(`sendEmailConfirmation error`, e.message, e.stack);
      throw e;
    }
  }

  async sendOTPCode(userEmail: string, otp: string): Promise<void> {
    try {
      // path to the template file
      const templatePath = join(__dirname, 'templates', 'send-otp.hbs');

      // Compile the Handlebars template with the provided context
      const html = this.compileTemplate(templatePath, {
        otp,
      });

      await this.sendEmail(userEmail, `Verification Code`, html);
    } catch (e) {
      console.error(`sendOTPCode error`, e.message, e.stack);
      throw e;
    }
  }

  async sendPasswordUpdateNotice(
    userEmail: string,
    userName: string,
  ): Promise<void> {
    try {
      // path to the template file
      const templatePath = join(__dirname, 'templates', 'password-updated.hbs');

      // Compile the Handlebars template with the provided context
      const html = this.compileTemplate(templatePath, {
        name: userName,
      });

      await this.sendEmail(userEmail, `Password Update Successful`, html);
    } catch (e) {
      console.error(
        `sendPasswordUpdateNotice error: Unable to send password update mail`,
        e.message,
        e.stack,
      );
      throw e;
    }
  }
}
