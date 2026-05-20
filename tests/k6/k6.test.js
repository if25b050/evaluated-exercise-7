import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 111,
    duration: '72s',
};

// The default exported function is gonna be picked up by k6 as the entry point for the test script. It will be executed repeatedly in "iterations" for the whole duration of the test.
export default function () {
    const baseUrl = 'http://host.docker.internal:5000';
    const counter = Math.random().toString(36).substr(2, 9); // Random string to create unique data for each request

    const userResponse = http.post(baseUrl + '/api/v1/users', JSON.stringify({ name: 'John Doe ' + counter, email: 'john.doe' + counter + '@example.com' }), { headers: { 'Content-Type': 'application/json' } });
    const user = userResponse.json().user;
    // simulate diverse user interactions
    const responses = http.batch([
        ['PUT', baseUrl + '/api/v1/users/' + user.id, JSON.stringify({ name: user.name + ' Updated' }), { headers: { 'Content-Type': 'application/json' } }],
        ['GET', baseUrl + '/api/v1/users'],
        ['POST', baseUrl + '/api/v1/posts', JSON.stringify({ title: 'Post Title ' + counter, content: 'Post Content ' + counter, userId: user.id }), { headers: { 'Content-Type': 'application/json' } }],
        ['GET', baseUrl + '/api/v1/posts'],
    ]);

    const delPostResponse = http.del(baseUrl + '/api/v1/posts/' + responses[2].json().post.id);

    const delUserResponse = http.del(baseUrl + '/api/v1/users/' + user.id);

    check(userResponse, { 'User created': (r) => r.status === 201 });
    // validate multiple endpoint responses
    check(responses[0], { 'User updated': (r) => r.status === 200 });
    check(responses[1], { 'Users retrieved': (r) => r.status === 200 });
    check(responses[2], { 'Post created': (r) => r.status === 201 });
    check(responses[3], { 'Posts retrieved': (r) => r.status === 200 });
    check(delPostResponse, { 'Post deleted': (r) => r.status === 200 });
    check(delUserResponse, { 'User deleted': (r) => r.status === 200 });

    // Sleep for 1 second to simulate real-world usage
    sleep(1);
}