
# [Webpack2 template](https://teaching-resources.griffith.edu.au/faculty-story/)

*This is a template of web page which use webpack2 as bundler*

## Contributors

* [Jeff Teng](mailto:j.teng@griffith.edu.au)

## Dependencies

* [Git](https://git-scm.com)
* [Node (v6)](https://nodejs.org)
* [NPM (v3)](https://www.npmjs.com)
* [EditorConfig](http://editorconfig.org)

## Getting Started

1\. Ensure all [Dependencies](#dependencies) have been resolved.

2\. Install application dependencies.

```bash
npm install
```

3\. Run build.

```bash
npm run build
```

> If you have issues when running the build, you may need to manually install the history module, `npm install history`.

## Testing

Testing provided by [Karma JS](https://karma-runner.github.io).

```bash
npm run test
```

## Deployment

*Deployment uses Subversion to migrate changes. All application dependencies need to be committed to to this Subversion repository because we do not have the ability to install them from each environment. Any compile processes like Webpack need to be run and their output files also committed to Subversion.*

1\. Create a release preparation [PowerShell](https://msdn.microsoft.com/en-us/powershell/mt173057.aspx) script:

```PowerShell
#
# Copies files needed for Develop to release changes via Subversion repository.
#
# See https://technet.microsoft.com/en-us/library/cc733145.aspx for robocopy docs.
#

$from = "D:\Workspace\faculty-story-react-git"
$to = "D:\Workspace\faculty-story-svn"

robocopy $from $to `
    /mir `
    /xd ".idea" `
    /xd ".svn" `
    /xd "node_modules" `
    /xd ".git"

# Now run commands from within the subversion directory.
cd $to

# Run production pre release commands.
npm install
npm prune

# Compile static assets and prepare dist.
npm run build
```

2\. Execute this script with PowerShell. Opening the script in the PowerShell ISE program is the easiest way to run it.

3\. Commit changes to Subversion. You will need to add any new files and delete any which have been removed.

4\. Use [Migration Manager](https://dsl1.secure.griffith.edu.au/subversion/list-migs.php) to migrate changes into target environment.
