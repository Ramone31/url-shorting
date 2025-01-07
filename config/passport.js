const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const userQuery = `
                    INSERT INTO users (google_id, email,name)
                    VALUES ($1, $2,$3)
                    ON CONFLICT (google_id) DO UPDATE SET email = $2
                    RETURNING id, email;
                `;
                const result = await pool.query(userQuery, [profile.id, profile.emails[0].value,profile.displayName]);
                return done(null, result.rows[0]);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
        if (err) return done(err, null);
        done(null, result.rows[0]);
    });
});

module.exports =passport;
