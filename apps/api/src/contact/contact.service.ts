import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import type { CreateContactMessageDto } from "./dto/create-contact-message.dto";

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateContactMessageDto) {
    const message = await this.prisma.contactMessage.create({ data: input });
    return { data: { message } };
  }
}
