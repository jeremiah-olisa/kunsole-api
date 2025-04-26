import { Injectable } from '@nestjs/common';
import { compile as compileTemplate } from 'handlebars';
import { readFile, access } from 'fs/promises';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { constants } from 'fs';

@Injectable()
export class TemplateService {
    private templateCache = new Map<string, HandlebarsTemplateDelegate>();

    constructor() { }

    async render(templatePath: string, data: any): Promise<string> {
        let template = this.templateCache.get(templatePath);


        if (!templatePath.endsWith('.hbs'))
            templatePath += '.hbs';

        // const fullPath = join(
        //     this.configService.get('MAIL_TEMPLATE_PATH', 'resources/views/mail'),
        //     templatePath
        // );

        await this.fileExistsOrThrow(templatePath);

        const source = await readFile(templatePath, 'utf-8');

        template = compileTemplate(source);
        this.templateCache.set(templatePath, template);

        return template(data);
    }

    private async fileExistsOrThrow(fullPath: string) {
        try {
            await access(fullPath, constants.F_OK);
            return true;
        }
        catch (err) {
            throw new Error(`Template file not found: ${fullPath}`);
        }
    }
}