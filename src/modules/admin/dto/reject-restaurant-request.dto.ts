import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class RejectRestaurantRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  rejectionReason!: string;
}