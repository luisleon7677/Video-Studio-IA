import { randomUUID } from 'crypto';
import { accessSync, constants, promises as fs } from 'fs';
import { dirname, join, resolve } from 'path';
import { tmpdir } from 'os';
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

  async requestRender(input: RequestRemotionRenderInput) {
    const jobId = `render-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const fileName = `${jobId}.mp4`;
    const renderDir = await fs.mkdtemp(join(tmpdir(), 'video-studio-remotion-'));
    const outputPath = resolve(renderDir, fileName);

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
      filePath: outputPath,
      message: 'Video renderizado correctamente.',
    };
  }

  async cleanupRenderFile(filePath: string): Promise<void> {
    try {
      await fs.rm(dirname(filePath), { recursive: true, force: true });
    } catch {
      // El render ya no es necesario despues del upload a S3.
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
