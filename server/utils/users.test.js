const expect = require("expect");
const { Users } = require("./users");

describe("Users", () => {
  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: 1,
        name: "shubham",
        room: "chat"
      },
      {
        id: 2,
        name: "guptaji",
        room: "chat"
      },
      {
        id: 3,
        name: "rupa",
        room: "chatsss"
      }
    ];
  });
  it("should add new user", () => {
    var users = new Users();
    var user = {
      id: 1,
      name: "gupta",
      room: "chat"
    };
    var res = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });
  it("should remove a user", () => {
    var useId = 1;
    var res = users.removeUser(useId);
    expect(users.users.length).toBe(2);
  });

  it("should not remove a user", () => {
    var useId = 43;
    var res = users.removeUser(useId);
    expect(users.users.length).toBe(3);
  });

  it("should find user", () => {
    var useId = 2;
    var res = users.getUser(useId);
    expect(res.id).toBe(useId);
  });

  it("should not find user", () => {
    var useId = 14;
    var res = users.getUser(useId);
    expect(res).toNotExist();
  });
  it("should return users for chat", () => {
    var userList = users.getUserList("chat");
    expect(userList).toEqual(["shubham", "guptaji"]);
  });
  it("should return users for chat", () => {
    var userList = users.getUserList("chatsss");
    expect(userList).toEqual(["rupa"]);
  });
});
