import { z } from "zod";
import {LANGUAGES, ROLES, STATUS} from "../../const";
export const validates = {
    login: z.object({
        username: z.string().nonempty("username is required"),
        password: z.string().min(6, "Password must be at least 8 characters long"),
    }),
    refreshToken: z.object({
        refreshToken: z.string().nonempty(),
    }),
    ChangePassword:z.object({
        oldPassword: z.string(),
        newPassword: z.string().regex(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?!.*\s)(?=.*?[~!#$@%^&*_\-+='|\\(){}[\];:”"<>,.?\/]).{8,}$/), "Sai định dạng").min(8, "Tối thiểu 8 kí tự"),
    }),
    registerUser: z.object({
        fullname: z.string(),
        bio: z.string().optional(),
        language: z.enum([LANGUAGES.ENGLISH, LANGUAGES.DANISH, LANGUAGES.DUTCH, LANGUAGES.FRENCH, LANGUAGES.SPANISH]).optional(),
        role: z.enum([ROLES.MEMBER]).optional(),
        password: z.string().regex(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?!.*\s)(?=.*?[~!#$@%^&*_\-+='|\\(){}[\];:”"<>,.?\/]).{8,}$/), "Sai định dạng").min(8, "Tối thiểu 8 kí tự"),
        email: z.string().regex(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), "Sai định dạng"),
        phone: z.string().regex(new RegExp(/((0[3|5|7|8|9]|01[2|6|8|9]|\+?84[3|5|7|8|9|12|16|18|19])+([0-9]{8}))|([1-9][0-9]{7,14})/), "Sai định dạng").min(9, "Tối thiểu là 9 số"),
        status: z.enum([STATUS.ACTIVE, STATUS.DISABLED]).optional()
    })
}
