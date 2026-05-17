"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const MEMBERS = [
    { name: '木村大暉', role: '運営', grade: 3, bio: '運営です。', imageUrl: null, github: null, twitter: null },
    { name: '山田理功', role: '運営', grade: 3, bio: '運営です。', imageUrl: null, github: null, twitter: null },
    { name: '大澤直明', role: '運営', grade: 3, bio: '浜大際実行委員です。', imageUrl: null, github: null, twitter: null },
];
async function main() {
    const email = process.env.ADMIN_EMAIL ?? 'd244022c@yokohama-cu.ac.jp';
    const password = process.env.ADMIN_PASSWORD ?? 'moca0425';
    const name = process.env.ADMIN_NAME ?? '木村大暉';
    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await prisma.admin.upsert({
        where: { email },
        update: {},
        create: { email, passwordHash, name },
    });
    console.log(`Admin: ${admin.name} (${admin.email})`);
    for (const data of MEMBERS) {
        const existing = await prisma.member.findFirst({ where: { name: data.name } });
        if (existing) {
            console.log(`Member skipped (already exists): ${data.name}`);
            continue;
        }
        const member = await prisma.member.create({ data });
        console.log(`Member created: ${member.name}`);
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map