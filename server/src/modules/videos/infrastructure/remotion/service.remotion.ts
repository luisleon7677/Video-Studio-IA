export interface RequestRemotionRenderInput {
  compositionId: string;
  templateId?: string;
  inputProps?: Record<string, unknown>;
}

export class RemotionService {
  async requestRender(input: RequestRemotionRenderInput) {
    const jobId = `render-${Date.now()}`;

    return {
      jobId,
      status: 'requested',
      compositionId: input.compositionId,
      templateId: input.templateId,
      inputProps: input.inputProps ?? {},
      message:
        'Solicitud de render recibida. Conecta aqui el worker de Remotion para generar el archivo final.',
    };
  }
}
