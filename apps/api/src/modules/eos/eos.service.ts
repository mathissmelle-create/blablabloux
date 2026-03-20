import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

type EosBlockResponse = {
  block_num: number;
  id: string;
};

@Injectable()
export class EosService {
  private readonly logger = new Logger(EosService.name);
  private readonly baseUrl: string;

  constructor(configService: ConfigService) {
    this.baseUrl = configService.get<string>("EOS_API_BASE_URL", "https://eos.greymass.com");
  }

  async getHeadBlockNumber(): Promise<number> {
    const response = await fetch(`${this.baseUrl}/v1/chain/get_info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    if (!response.ok) {
      throw new Error(`EOS get_info failed with status ${response.status}`);
    }

    const payload = (await response.json()) as { head_block_num: number };
    return payload.head_block_num;
  }

  async getBlockHash(blockNumber: number): Promise<string> {
    const response = await fetch(`${this.baseUrl}/v1/chain/get_block`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ block_num_or_id: blockNumber }),
    });

    if (!response.ok) {
      throw new Error(`EOS get_block failed with status ${response.status}`);
    }

    const payload = (await response.json()) as EosBlockResponse;
    return payload.id;
  }

  async waitForBlockHash(blockNumber: number, retries = 20): Promise<string> {
    for (let attempt = 0; attempt < retries; attempt += 1) {
      try {
        const hash = await this.getBlockHash(blockNumber);
        if (hash) {
          return hash;
        }
      } catch (error) {
        this.logger.warn(
          `EOS block ${blockNumber} unavailable at attempt ${attempt + 1}: ${(error as Error).message}`,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 1_500));
    }

    throw new Error(`EOS block ${blockNumber} not available after ${retries} attempts`);
  }
}
