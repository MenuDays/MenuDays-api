import { PartialType } from '@nestjs/swagger';
import { CreateMenuCollectionDto } from './create-menu-collection.dto';

export class UpdateMenuCollectionDto extends PartialType(CreateMenuCollectionDto) {}
