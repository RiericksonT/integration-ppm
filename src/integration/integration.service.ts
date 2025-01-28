import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationService {
  sync(body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return body;
  }
}
