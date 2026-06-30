import { randomUUID } from 'crypto';
import { accessSync, constants, promises as fs } from 'fs';
import { basename, resolve } from 'path';
import { promisify } from 'util';
import { execFile } from 'child_process';

const execFileAsync = promisify(execFile);

export interface RequestRemotionRenderInput {
  compositionId: string;
  templateId?: string;
  inputProps?: Record<string, unknown>;
}

export class RemotionService {
  private readonly clientDir = this.resolveClientDir();
  private readonly renderDir = this.resolveRenderDir();

  async requestRender(input: RequestRemotionRenderInput) {
    const jobId = `render-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const fileName = `${jobId}.mp4`;
    const outputPath = resolve(this.renderDir, fileName);

    await fs.mkdir(this.renderDir, { recursive: true });

    const remotionCli = resolve(
      this.clientDir,
      'node_modules',
      '@remotion',
      'cli',
      'remotion-cli.js',
    );

    await this.assertReadable(remotionCli, 'No se encontro el CLI de Remotion');

    const args = [
      remotionCli,
      'render',
      'src/remotion/index.ts',
      input.compositionId,
      outputPath,
      `--props=${JSON.stringify(input.inputProps ?? {})}`,
      '--overwrite',
    ];

    try {
      await execFileAsync(process.execPath, args, {
        cwd: this.clientDir,
        maxBuffer: 1024 * 1024 * 10,
        windowsHide: true,
      });
    } catch (error) {
      const message = this.getCommandErrorMessage(error);
      throw new Error(`No se pudo renderizar el video: ${message}`);
    }

    return {
      jobId,
      status: 'completed',
      compositionId: input.compositionId,
      templateId: input.templateId,
      inputProps: input.inputProps ?? {},
      fileName,
      downloadUrl: `/videos/animations/render/download/${fileName}`,
      message: 'Video renderizado. Ya puedes descargar el MP4.',
    };
  }

  async getRenderFilePath(fileName: string): Promise<string | null> {
    const safeFileName = basename(fileName);

    if (safeFileName !== fileName || !safeFileName.endsWith('.mp4')) {
      return null;
    }

    const filePath = resolve(this.renderDir, safeFileName);

    try {
      await fs.access(filePath, constants.R_OK);
      return filePath;
    } catch {
      return null;
    }
  }

  private resolveClientDir(): string {
    const candidates = [
      resolve(process.cwd(), 'client'),
      resolve(process.cwd(), '..', 'client'),
    ];

    for (const candidate of candidates) {
      try {
        accessSync(resolve(candidate, 'package.json'), constants.R_OK);
        return candidate;
      } catch {
        continue;
      }
    }

    return candidates[0];
  }

  private resolveRenderDir(): string {
    const cwd = process.cwd();
    const serverDir = cwd.endsWith('server') ? cwd : resolve(cwd, 'server');
    return resolve(serverDir, 'renders', 'animations');
  }

  private async assertReadable(path: string, message: string): Promise<void> {
    try {
      await fs.access(path, constants.R_OK);
    } catch {
      throw new Error(`${message}: ${path}`);
    }
  }

  private getCommandErrorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null) {
      const commandError = error as {
        message?: string;
        stdout?: string;
        stderr?: string;
      };

      return (
        commandError.stderr?.trim() ||
        commandError.stdout?.trim() ||
        commandError.message ||
        'Render fallido'
      );
    }

    return 'Render fallido';
  }
}
