import { prisma } from "./prisma";

export async function seedIfEmpty() {
  const existing = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  if (existing) return;

  await prisma.siteConfig.create({
    data: {
      id: 1,
      brandName: "The House",
      taglineEn: "The confluence of capital, research, and visionary founders.",
      taglineZh: "资本、研究与远见创始人的交汇点。",
      missionEn: "An elite VC + Labs + Community hub accelerating cross-border innovation.",
      missionZh: "以 VC + Labs + Community 为核心的精英创新枢纽，推动跨境创新。",
      heroBadgeEn: "Private Members Club",
      heroBadgeZh: "精英私享俱乐部",
      heroTitle: "The House",
      heroSubtitleEn: "Elite VC + Labs + Community",
      heroSubtitleZh: "精英 VC + Labs + Community",
      heroDescEn:
        "A Silicon Valley residence for capital, research, and founders shaping the future. Curated programs, private salons, and fellowship cohorts define our merit-based ecosystem.",
      heroDescZh:
        "面向资本、研究与创始人的硅谷创新居所。精选项目、私享沙龙与 Fellowship 共同构建以能力为核心的生态系统。",
      heroPrimaryCtaEn: "Apply for Membership",
      heroPrimaryCtaZh: "申请会员",
      heroSecondaryCtaEn: "View Programs",
      heroSecondaryCtaZh: "查看项目",
      aboutTitleEn: "A Mission-Driven Ecosystem",
      aboutTitleZh: "使命驱动的生态体系",
      aboutLeadEn:
        "We bridge capital, frontier research, and global founders through a highly curated, invitation-led community.",
      aboutLeadZh: "通过邀请制与严格筛选，连接资本、前沿研究与全球创始人。",
      aboutPillars: JSON.stringify([
        {
          titleEn: "VC",
          titleZh: "VC",
          descriptionEn: "Access to cross-border capital and strategic partners driving deep tech ventures.",
          descriptionZh: "跨境资本与战略合作伙伴，支持深科技创业。",
          icon: "💰",
          imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop&q=80",
        },
        {
          titleEn: "Labs",
          titleZh: "Labs",
          descriptionEn: "A sandbox for emerging research, founder experimentation, and prototype acceleration.",
          descriptionZh: "前沿研究与创始人实验的加速空间。",
          icon: "🔬",
          imageUrl: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&h=600&fit=crop&q=80",
        },
        {
          titleEn: "Community",
          titleZh: "Community",
          descriptionEn: "A merit-based network of founders, researchers, and investors with shared ambition.",
          descriptionZh: "以能力为核心的创始人、研究者与投资人网络。",
          icon: "🤝",
          imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&q=80",
        },
      ]),
      contactTitleEn: "Contact",
      contactTitleZh: "联系",
      contactSubtitleEn: "Invitation-only visits. Request a private tour or partnership call.",
      contactSubtitleZh: "仅限受邀参观。可申请私享参观或合作洽谈。",
      contactEmail: "hello@thehouse.ai",
      contactAddressEn: "Hillsborough, California",
      contactAddressZh: "加州 Hillsborough",
      contactCtaEn: "Request Access",
      contactCtaZh: "申请访问",
    },
  });

  await prisma.program.createMany({
    data: [
      {
        type: "Fellowship",
        titleEn: "Founders Fellowship",
        titleZh: "创始人 Fellowship",
        date: "Monthly",
        location: "Silicon Valley",
        descriptionEn: "A selective cohort connecting Stanford/MIT talent with venture partners.",
        descriptionZh: "连接斯坦福/MIT 人才与投资合伙人的精英项目。",
        link: "#",
        sortOrder: 1,
      },
      {
        type: "Salon",
        titleEn: "Capital & Frontier Tech Salon",
        titleZh: "资本与前沿科技沙龙",
        date: "Mar 2026",
        location: "Hillsborough",
        descriptionEn: "Private roundtables with VC partners and frontier researchers.",
        descriptionZh: "与顶级 VC 伙伴及前沿研究者的私享圆桌。",
        link: "#",
        sortOrder: 2,
      },
      {
        type: "Accelerator",
        titleEn: "Cross-Border Venture Launch",
        titleZh: "跨境 Venture Launch",
        date: "Apr 2026",
        location: "San Francisco Bay Area",
        descriptionEn: "A joint accelerator with China-US founder teams and capital partners.",
        descriptionZh: "中美创始团队与资本伙伴的联合加速器。",
        link: "#",
        sortOrder: 3,
      },
    ],
  });

  await prisma.insight.createMany({
    data: [
      {
        titleEn: "2026 Frontier Tech Outlook",
        titleZh: "2026 前沿科技展望",
        descriptionEn: "A private brief on emerging AI and deep tech trajectories.",
        descriptionZh: "关于 AI 与深科技趋势的私享简报。",
        link: "#",
        sortOrder: 1,
      },
      {
        titleEn: "Cross-Border Capital Playbook",
        titleZh: "跨境资本作战手册",
        descriptionEn: "Strategic guidance for founders entering US and China markets.",
        descriptionZh: "面向中美市场的创始人战略指南。",
        link: "#",
        sortOrder: 2,
      },
      {
        titleEn: "House Member Signals",
        titleZh: "会员信号",
        descriptionEn: "Monthly intelligence from our member-only salons.",
        descriptionZh: "来自私享沙龙的每月情报。",
        link: "#",
        sortOrder: 3,
      },
    ],
  });

  await prisma.partner.createMany({
    data: [
      { name: "Beta Fund", sortOrder: 1 },
      { name: "UpHonest", sortOrder: 2 },
      { name: "CAN", sortOrder: 3 },
      { name: "Stanford", sortOrder: 4 },
      { name: "MIT", sortOrder: 5 },
      { name: "Industry Fellows", sortOrder: 6 },
    ],
  });
}
