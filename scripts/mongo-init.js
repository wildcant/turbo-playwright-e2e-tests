// Initialize mongo test db.
db.createUser({
  user: 'root',
  pwd: 'root',
  roles: [
    {
      role: 'readWrite',
      db: 'test',
    },
  ],
})
