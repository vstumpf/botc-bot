import type {
  GuildMember,
} from 'discord.js';

export const isGuildMemberConnectedToVoice = (member: GuildMember): boolean => {
  return member.guild.voiceStates.cache
    .filter((user) => user.id === member.id)
    .first()?.channelId != null;
};

export const isGuildMemberInChannel = (member: GuildMember, channelId: string): boolean => {
  return member.guild.voiceStates.cache
    .filter((user) => user.id === member.id)
    .first()?.channelId === channelId;
};
