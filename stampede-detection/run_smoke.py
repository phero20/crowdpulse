"""Simple smoke test to check imports for core dependencies."""
modules = ['cv2', 'numpy', 'pandas', 'pywhatkit', 'pygame', 'torch']

if __name__ == '__main__':
    for m in modules:
        try:
            __import__(m)
            print(f"{m}: OK")
        except Exception as e:
            print(f"{m}: ERROR: {e}")