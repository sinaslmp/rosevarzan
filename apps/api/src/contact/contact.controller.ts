import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { CreateContactMessageDto } from "./dto/create-contact-message.dto";
import { ContactService } from "./contact.service";

@Controller("contact")
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  @Post() @HttpCode(201)
  create(@Body() input: CreateContactMessageDto) {
    return this.contact.create(input);
  }
}
