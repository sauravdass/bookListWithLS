//catching form element
const form = document.getElementById("book_form");
const bookList = document.getElementById("book_list");

//book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// ui class
class Ui {
  static addBookList(b) {
    const list = document.getElementById("book_list");
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${b.title}</td>
        <td>${b.author}</td>
        <td>${b.isbn}</td>
        <td><a href="#">x</a></td>
    `;
    list.appendChild(tr);
  }

  static clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }

  static showAlert(message, className) {
    const container = document.querySelector(".container");
    const div = document.createElement("div");
    div.innerText = message;
    div.className = `alert ${className}`;
    container.insertBefore(div, form);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  static deleteBookList(target) {
    if (target.hasAttribute("href")) {
      target.parentElement.parentElement.remove();
      Store.removeBook(
        target.parentElement.previousElementSibling.textContent.trim()
      );

      Ui.showAlert("Book Removed!", "bg-warning text-white");
    }
  }
}

//local storage class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    let books = Store.getBooks();
    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static displayBooks() {
    let books = Store.getBooks();

    books.forEach((book) => {
      Ui.addBookList(book);
    });
  }

  static removeBook(isbn) {
    let books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

//add eventListner
form.addEventListener("submit", addBook);
bookList.addEventListener("click", removeList);
document.addEventListener("DOMContentLoaded", Store.displayBooks());

//add book function
function addBook(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;
  const book = new Book(title, author, isbn);

  if (title === "" || author === "" || isbn === "") {
    Ui.showAlert("Please fill all the fields!", "bg-danger text-white");
  } else {
    Ui.showAlert("Book Added Successfully!", "bg-success text-white");
    Ui.addBookList(book);
    Ui.clearFields();
    Store.addBook(book);
  }
}

//remove book list
function removeList(e) {
  e.preventDefault();
  Ui.deleteBookList(e.target);
}
