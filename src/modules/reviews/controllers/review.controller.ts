import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../../core/common/decorators/current-user.decorator';

import { CreateReviewDto } from '../dto/create-review.dto';
import { ReplyReviewDto } from '../dto/reply-review.dto';

import { ReviewsService } from '../services/review.service';

@ApiTags('Reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
  ) {}

  /**
   * Crear una reseña.
   */
  @Post('reviews')
  @ApiOperation({
    summary: 'Crear reseña',
  })
  @ApiBody({
    type: CreateReviewDto,
  })
  create(
    @CurrentUser('id') userId: bigint,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(
      userId,
      createReviewDto,
    );
  }

  /**
   * Obtener las reseñas públicas de un restaurante.
   */
  @Get('restaurants/:restaurantId/reviews')
  @ApiOperation({
    summary: 'Obtener reseñas de un restaurante',
  })
  @ApiParam({
    name: 'restaurantId',
    description: 'ID del restaurante',
    example: 1,
  })
  findRestaurantReviews(
    @Param('restaurantId', ParseIntPipe)
    restaurantId: number,
  ) {
    return this.reviewsService.findRestaurantReviews(
      BigInt(restaurantId),
    );
  }

  /**
   * Responder una reseña.
   */
  @Patch('reviews/:reviewId/reply')
  @ApiOperation({
    summary: 'Responder reseña',
  })
  @ApiParam({
    name: 'reviewId',
    description: 'ID de la reseña',
    example: 1,
  })
  @ApiBody({
    type: ReplyReviewDto,
  })
  reply(
    @CurrentUser('id') userId: bigint,
    @Param('reviewId', ParseIntPipe)
    reviewId: number,
    @Body() replyReviewDto: ReplyReviewDto,
  ) {
    return this.reviewsService.reply(
      userId,
      BigInt(reviewId),
      replyReviewDto,
    );
  }
}