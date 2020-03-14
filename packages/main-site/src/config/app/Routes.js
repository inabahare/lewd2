import index    from "../../Routes";
import login    from "../../Routes/login";
import upload   from "../../Routes/upload";
import user     from "../../Routes/user";
import register from "../../Routes/register";
import deleter  from "../../Routes/delete"; // God damn reserved keywo~~rds
import admin    from "../../Routes/admin";


class Routes {
    static SetPages(app) {
        app.use("/upload",     upload);



        app.use("/",           index);
        app.use("/login",      login);
        app.use("/register",   register);
        app.use("/delete",     deleter);
        app.use("/user",       user);
        app.use("/user/admin", admin);
    }

    static SetErrorPages(app) {
        app.use((req, res,) =>{
            res.status(404)
               .render("404");
        });
    }
}

export { Routes };