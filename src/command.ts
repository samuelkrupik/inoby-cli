abstract class Command {
  public run() {}

  protected getStubFileContents() {}

  protected abstract getStubPath(): string;
}
