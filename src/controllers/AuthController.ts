import { Body, Controller, Get, Param, Post, UseInterceptor } from 'routing-controllers';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { User } from '../models/User';

@Controller()
export class AuthController {

  @Post('/sign-in')
  @UseInterceptor(EntityInterceptor)
  signIn(@Body() information: { email: string, password: string }) {
    return {
      information,
      result: 'sign in successfully',
    };
  }

  @Post('/sign-up')
  @UseInterceptor(EntityInterceptor)
  signUp(@Body() user: User) {
    return {
      user,
      result: 'sign-up successfully',
    };
  }

  @Get('/sign-out')
  @UseInterceptor(EntityInterceptor)
  signOut() {
    return `sign out successfully`;
  }

  @Get('/user-by-token/:token')
  @UseInterceptor(EntityInterceptor)
  getUserByToken(@Param('token') token: string) {
    return `delete item number ${token}`;
  }

}
