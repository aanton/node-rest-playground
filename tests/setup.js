expect.extend({
  toBeRouteNotFound(response) {
    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
    expect(response.body.error).toMatch(/Route not found/);

    return { pass: !this.isNot };
  },

  toBeModelValidationError(response) {
    expect(response.status).toBe(500);
    expect(response.body.error).toMatch(/SequelizeValidationError/);

    return { pass: !this.isNot };
  },

  toBeCommentNotFound(response) {
    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/Comment.+not found/);

    return { pass: !this.isNot };
  },

  toBePostNotFound(response) {
    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/Post.+not found/);

    return { pass: !this.isNot };
  },

  toBeTagNotFound(response) {
    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/Tag.+not found/);

    return { pass: !this.isNot };
  },
});
