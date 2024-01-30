// /services/features/karma.service.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Assuming discordId is a unique field in your Member model.

class KarmaService {
  static async checkKarma(discordId: string): Promise<number> {
    try {
      const member = await prisma.member.findUnique({
        where: { discordId },
      });
      return member ? member.karmaPoints : 0;
    } catch (error) {
      console.error("Error fetching karma:", error);
      throw error;
    }
  }

  static async updateKarma(discordId: string, points: number): Promise<void> {
    try {
      const member = await prisma.member.findUnique({
        where: { discordId },
      });
      if (member) {
        const updatedMember = await prisma.member.update({
          where: { discordId },
          data: {
            karmaPoints: {
              increment: points,
            },
          },
        });
        console.log(
          `Updated karma for ${discordId}:`,
          updatedMember.karmaPoints
        );
      } else {
        console.log(
          `Member not found for ${discordId}, unable to update karma.`
        );
      }
    } catch (error) {
      console.error("Error updating karma:", error);
      throw error;
    }
  }
}

export default KarmaService;
