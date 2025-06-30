// Nav shadow on scroll
let header = document.querySelector("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("shadow", window.scrollY > 0);
});

// jQuery: filter by category + search
$(document).ready(function () {
  $(".filter-item").click(function () {
    const value = $(this).attr("data-filter");
    if (value == "all") {
      $(".post-box").show("1000");
    } else {
      $(".post-box")
        .not("." + value)
        .hide(1000);
      $(".post-box")
        .filter("." + value)
        .show("1000");
    }

    $(this).addClass("active-filter").siblings().removeClass("active-filter");
  });

  $("#searchInput").on("input", function () {
    const keyword = $(this).val().toLowerCase();
    $(".post-box").each(function () {
      const category = $(this).find(".category").text().toLowerCase();
      const title = $(this).find(".post-title").text().toLowerCase();
      const author = $(this).find(".profile-name").text().toLowerCase();
      if (
        title.includes(keyword) ||
        author.includes(keyword) ||
        category.includes(keyword)
      ) {
        $(this).removeClass("hidden");
      } else {
        $(this).addClass("hidden");
      }
    });
  });
});

// Toggle Read More
function toggleReadMore() {
  const extra = document.getElementById("extra-about");
  extra.style.display =
    extra.style.display === "none" || extra.style.display === ""
      ? "block"
      : "none";
}

// Capitalize utility
function capitalize(text) {
  return typeof text === "string"
    ? text.charAt(0).toUpperCase() + text.slice(1)
    : "";
}

// Create Post
function createPost() {
  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();
  const tags = document.getElementById("post-tags").value.trim().toUpperCase();
  const hashtags = document.getElementById("post-hashtags").value.trim();

  const postImageInput = document.getElementById("post-image");
  const profileImageInput = document.getElementById("profile-image");

  if (!title || !content || !tags || !hashtags) {
    alert("Please fill all fields.");
    return;
  }

  const readerPost = new FileReader();
  const readerProfile = new FileReader();

  readerPost.onload = function () {
    const imageUrl = readerPost.result;

    readerProfile.onload = function () {
      const profileUrl = readerProfile.result;

      savePost(title, content, tags, imageUrl, profileUrl, hashtags);
    };

    if (profileImageInput.files[0]) {
      readerProfile.readAsDataURL(profileImageInput.files[0]);
    } else {
      savePost(
        title,
        content,
        tags,
        imageUrl,
        "assets/default-profile.jpg",
        hashtags
      );
    }
  };

  if (postImageInput.files[0]) {
    readerPost.readAsDataURL(postImageInput.files[0]);
  } else {
    savePost(
      title,
      content,
      tags,
      "assets/default-post.jpg",
      "assets/default-profile.jpg",
      hashtags
    );
  }
}

// Save Post
function savePost(title, content, tags, imageUrl, profileUrl, hashtags) {
  const newPost = {
    id: Date.now(),
    title,
    content,
    tags,
    hashtags,
    imageUrl,
    profileUrl,
    author:
      JSON.parse(localStorage.getItem("currentUser"))?.username || "Anonymous",
    date: new Date().toLocaleDateString(),
  };

  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.unshift(newPost);
  localStorage.setItem("posts", JSON.stringify(posts));

  renderPost(newPost);
  updateFilter(tags);
  loadComments(newPost.id);

  // Clear form
  document.getElementById("post-title").value = "";
  document.getElementById("post-content").value = "";
  document.getElementById("post-tags").value = "";
  document.getElementById("post-hashtags").value = "";
  document.getElementById("post-image").value = "";
  document.getElementById("profile-image").value = "";

  alert("Post created successfully!");
}

// Render Post
function renderPost(post) {
  const container = document.querySelector(".posts-container");
  const postBox = document.createElement("div");
  postBox.className = `post-box ${post.tags}`;
  postBox.innerHTML = `
    <img src="${post.imageUrl}" class="post-img" />
    <h2 class="category">${post.tags}</h2>
    <a href="#" class="post-title">${post.title}</a>
    <span class="post-date">${post.date}</span>
    <p class="post-description">${post.content}</p>
    <p class="post-hashtags">${post.hashtags}</p>
    <div class="profile">
      <img src="${post.profileUrl}" class="profile-img" />
      <span class="profile-name">${post.author}</span>
    </div>
    <div class="comment-section">
      <h4>Leave a Comment</h4>
      <div class="comment-input-wrapper">
        <textarea id="text-${post.id}" class="newcomment" placeholder="Write your comment here..."></textarea>
        <i class="fas fa-paper-plane submit-icon" onclick="submitComment(${post.id})"></i>
      </div>
      <div id="comments-${post.id}" class="comments"></div>
    </div>
  `;
  container.prepend(postBox);
}

// Submit Comment
function submitComment(postId) {
  const user = JSON.parse(localStorage.getItem("user"));
  const textarea = document.getElementById(`text-${postId}`);
  const text = textarea.value.trim();

  if (!user || !user.name) return alert("User not logged in.");
  if (!text) return alert("Please enter a comment.");

  const key = `comments-${postId}`;
  const comments = JSON.parse(localStorage.getItem(key)) || [];
  comments.push({ name: user.name, text });
  localStorage.setItem(key, JSON.stringify(comments));

  textarea.value = "";
  loadComments(postId);
}

// Load Comments
function loadComments(postId) {
  const key = `comments-${postId}`;
  const comments = JSON.parse(localStorage.getItem(key)) || [];
  const container = document.getElementById(`comments-${postId}`);
  if (!container) return;
  container.innerHTML = "";
  comments.forEach((c) => {
    container.innerHTML += `<p><strong>${c.name}</strong>: ${c.text}</p>`;
  });
}

// Update filter list with new category if needed
function updateFilter(category) {
  const filterContainer = document.querySelector(".post-filter");
  const existing = [...filterContainer.querySelectorAll(".filter-item")].map(
    (f) => f.dataset.filter.toLowerCase()
  );

  if (!existing.includes(category)) {
    const span = document.createElement("span");
    span.className = "filter-item";
    span.setAttribute("data-filter", category);
    span.innerText = capitalize(category);
    filterContainer.appendChild(span);
  }
}

// Initialize posts and comments
window.addEventListener("DOMContentLoaded", () => {
  const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
  savedPosts.forEach((post) => {
    renderPost(post);
    updateFilter(post.tags);
    loadComments(post.id);
  });

  // Hardcoded posts IDs
  const hardcodedIds = [101, 102, 103, 104, 105, 106, 107, 108, 109];
  hardcodedIds.forEach((id) => loadComments(id));
});

// Mock current user (for testing)
localStorage.setItem("user", JSON.stringify({ id: "u123", name: "Kainat" }));

// Logout
function logout() {
  localStorage.removeItem("isLoggedIn");
  alert("You have been logged out.");
  window.location.href = "signup.html";
}
