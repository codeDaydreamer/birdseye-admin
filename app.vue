<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
onMounted(() => {
  const htmlEl = document.documentElement

  const applyTheme = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    htmlEl.classList.toggle('dark', prefersDark)
  }

  applyTheme() // Initial run

  // Listen for changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme)
});

</script>
