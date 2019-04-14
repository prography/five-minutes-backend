import { Body, Controller, Get, Param, Post } from 'routing-controllers';
import { User } from '../models/User';

@Controller()
export class AuthController {

  @Post('/sign-in')
  signIn(@Body() information: { email: string, password: string }) {
    return {
      information,
      result: 'sign in successfully',
    };
  }

  @Post('/sign-up')
  signUp(@Body() user: User) {
    return {
      user,
      result: 'sign-up successfully',
    };
  }

  @Get('/sign-out')
  signOut() {
    return `sign out successfully`;
  }

  @Get('/user-by-token/:token')
  getUserByToken(@Param('token') token: string) {
    return `delete item number ${token}`;
  }

}
