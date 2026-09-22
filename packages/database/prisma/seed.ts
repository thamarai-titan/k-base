import { PrismaClient, EntryType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding initial categories, tags, and entries...");

  // Clean existing data
  await prisma.entry.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.category.deleteMany({});

  // 1. Categories
  const gitCategory = await prisma.category.create({
    data: {
      name: "Git & Version Control",
      slug: "git",
    },
  });

  const linuxCategory = await prisma.category.create({
    data: {
      name: "Linux & Shell",
      slug: "linux",
    },
  });

  const dockerCategory = await prisma.category.create({
    data: {
      name: "Docker & Containers",
      slug: "docker",
    },
  });

  const webCategory = await prisma.category.create({
    data: {
      name: "Web Development",
      slug: "web-dev",
    },
  });

  // 2. Entries
  await prisma.entry.create({
    data: {
      title: "Interactive Rebase to squash last N commits",
      type: EntryType.COMMAND,
      content: "git rebase -i HEAD~3",
      description: "Opens an interactive editor allowing you to squash, reword, or drop the last 3 commits before pushing.",
      example: "Pick first commit with 'pick', then change subsequent commits to 'squash' or 's'.",
      categoryId: gitCategory.id,
      tags: {
        create: [{ name: "git" }, { name: "vcs" }, { name: "rebase" }],
      },
    },
  });

  await prisma.entry.create({
    data: {
      title: "Inspect Open Ports & Listening Sockets",
      type: EntryType.COMMAND,
      content: "ss -tulpn",
      description: "Quickly view all TCP/UDP listening ports, along with the process IDs and program names owning them.",
      example: "sudo ss -tulpn | grep 3000",
      categoryId: linuxCategory.id,
      tags: {
        create: [{ name: "networking" }, { name: "linux" }, { name: "ports" }],
      },
    },
  });

  await prisma.entry.create({
    data: {
      title: "Clean Up Dangling Docker Objects",
      type: EntryType.COMMAND,
      content: "docker system prune -a --volumes",
      description: "Removes all unused containers, networks, images (not just dangling ones with -a), and optionally volumes.",
      example: "docker system prune -a -f",
      categoryId: dockerCategory.id,
      tags: {
        create: [{ name: "docker" }, { name: "cleanup" }],
      },
    },
  });

  await prisma.entry.create({
    data: {
      title: "CORS (Cross-Origin Resource Sharing) Fundamentals",
      type: EntryType.NOTE,
      content: "CORS is a browser security mechanism that restricts HTTP requests initiated from scripts to a different origin (domain, protocol, or port). The server must return appropriate Access-Control-Allow-Origin headers to permit cross-origin access.",
      description: "Key HTTP headers: Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers.",
      categoryId: webCategory.id,
      tags: {
        create: [{ name: "http" }, { name: "security" }, { name: "cors" }],
      },
    },
  });

  await prisma.entry.create({
    data: {
      title: "Next.js Fetch with Revalidation Snippet",
      type: EntryType.SNIPPET,
      content: `export async function getEntries() {
  const res = await fetch("http://localhost:5001/api/entries", {
    next: { revalidate: 60 } // revalidate cache every 60s
  });
  if (!res.ok) throw new Error("Failed to fetch entries");
  return res.json();
}`,
      description: "Data fetching pattern using Next.js App Router with ISR (Incremental Static Regeneration).",
      categoryId: webCategory.id,
      tags: {
        create: [{ name: "nextjs" }, { name: "typescript" }, { name: "react" }],
      },
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
