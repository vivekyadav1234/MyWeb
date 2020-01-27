<p><b>Registration</b></p>
<pre>curl --data "email=test@test.com&password=testpassword1&password_confirmation=testpassword1&confirm_success_url=http://localhost:3000" http://localhost:3000/auth</pre>
<br />
<p><b>Login</b></p>
<pre>curl -XPOST -v -H 'Content-Type: application/json' localhost:3000/auth/sign_in -d '{"email": "test@test.com", "password": "testpassword1" }'</pre>
<br />
<p><b>Confirm token is valid</b></p>
<pre>curl -XGET -v -H 'Content-Type: application/json' -H 'access-token: Avj8j2wQ4JAlFUDuPbS3fQ' -H 'client: r4Pn4MLXvpCFTkwSc0HD7w' -H "uid: test@test.com" localhost:3000/auth/validate_token`</pre>
<br />
<p><b>Users List </b></p>
<pre>curl -XGET -v -H 'Content-Type: application/json' -H 'access-token: 2J6ygFVQrYHGy6aSH25D_g' -H 'client: r4Pn4MLXvpCFTkwSc0HD7w' -H "uid: test@test.com" localhost:3000/v1/users/</pre>
<br />

Swagger API for API integration testing
*** rake rswag ***
