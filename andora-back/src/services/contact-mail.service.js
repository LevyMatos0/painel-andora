import nodemailer from 'nodemailer';

export async function sendContactEmail(message, { env = process.env, createTransport = nodemailer.createTransport } = {}) {
  // Read at send time: dotenv has loaded by then. Credentials stay in the API.
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) return { status: 'desativado' };
  const port = Number(env.SMTP_PORT || 465);
  const secure = env.SMTP_SECURE == null ? port === 465 : env.SMTP_SECURE === 'true';
  const transport = createTransport({
    host: env.SMTP_HOST,
    port,
    secure,
    requireTLS: !secure,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });
  try {
    const result = await transport.sendMail({
      from: { name: 'Contato Andora', address: env.SMTP_USER },
      to: env.CONTACT_EMAIL || env.SMTP_USER,
      replyTo: { name: message.nome, address: message.email },
      subject: `[Andora] ${message.assunto.replace(/[\r\n]/g, ' ')}`,
      text: [
        `Mensagem #${message.id} recebida pelo site Andora`,
        `Nome: ${message.nome}`,
        `E-mail: ${message.email}`,
        ...(message.telefone ? [`Telefone: ${message.telefone}`] : []),
        `Assunto: ${message.assunto}`,
        '',
        message.conteudo,
        '',
        'A mensagem também está disponível no painel administrativo.',
      ].join('\n'),
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    if (!result.accepted?.length) throw new Error('SMTP did not accept the recipient');
    return { status: 'enviado' };
  } finally {
    transport.close();
  }
}

export async function notifyContact(message, send = sendContactEmail, logger = console) {
  try { return await send(message); }
  catch (error) {
    // Never log SMTP responses or credentials; the database record already exists.
    const code = ['EAUTH', 'ECONNECTION', 'ETIMEDOUT', 'ESOCKET', 'EENVELOPE', 'EMESSAGE'].includes(error.code) ? error.code : 'SMTP_ERROR';
    logger.warn(`Aviso de contato não enviado (${code}); mensagem #${message.id} preservada no painel.`);
    return { status: 'pendente' };
  }
}
