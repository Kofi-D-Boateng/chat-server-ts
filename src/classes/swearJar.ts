/**
 * @author Kofi Boateng
 * @class Swear Jar Singleton
 * @description A Singleton that houses a set, or jar, of swear words to check for within a corpus of strings
 */
class SwearJar {
  private static instance: SwearJar;
  private static readonly jar: Set<string> = new Set();

  constructor() {
    if (!SwearJar.instance) {
      SwearJar.instance = this;
    }
    this.insertSwearWord(SwearJar.jar);
    return SwearJar.instance;
  }
  /**
   * @returns set<string>
   * @description Returns a set of swear words to check for within a corpus of strings
   */
  public static getJar(): Set<string> {
    if (!SwearJar.instance) {
      SwearJar.instance = new SwearJar();
    }
    return SwearJar.jar;
  }
  /**
   *
   * @param jar Set<String>
   * @returns void
   * @description Inserts the swear words into the jar via environmental arguments
   */
  private insertSwearWord(jar: Set<string>): void {
    const words: string[] | undefined = process.env.SWEAR_WORDS?.split(",");
    if (!words) {
      console.log("[WARNING]: Swear words were not added to system args....");
      return;
    }
    for (const word of words) jar.add(word);
  }
}
