import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreException: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  /**
   * Determines if the user JWT token is valid.
   * On successfull validation, returns jwt payload (assigned to req.user)
   * @param payload
   */
   
   async validate(payload: any) {
    const user = await this.UserService.findOne({ GIUemail: payload.email });
    if (!user || user.password !== payload.password)
      throw new UnauthorizedException("Credentials incorrect");
    return user;
   }

    /*
      Each JWT has a "payload" section, which includes 
      the data we insert into the JWT object when
      creating and signing it (auth.service.ts)

      If the JWT bearer header auth token is not valid
      an exception is thrown

      Otherwise, the JWT payload is returned.
      More specifically, Passport will create a "user" property
      on the Express HTTP Request object and assign whatever 
      is returned here to req.user
    */
}
