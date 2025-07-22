function makeFriendsList(friends) {
  let ul = document.createElement('ul');
  
  friends.forEach(friend => {
    const text = `${friend.firstName} ${friend.lastName}`;
    const li = document.createElement('li');
    li.innerHTML = text;
    ul.append(li);
  });
  
  return ul;
}
